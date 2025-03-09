"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatLayout;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const auth_helpers_nextjs_1 = require("@supabase/auth-helpers-nextjs");
const use_toast_1 = require("@/hooks/use-toast");
const button_1 = require("@/components/ui/button");
const skeleton_1 = require("@/components/ui/skeleton");
const scroll_area_1 = require("@/components/ui/scroll-area");
const input_1 = require("@/components/ui/input");
const avatar_1 = require("@/components/ui/avatar");
const lucide_react_1 = require("lucide-react");
const contact_list_1 = require("./contact-list");
const message_list_1 = require("./message-list");
const contact_store_1 = require("@/lib/stores/contact-store");
const message_store_1 = require("@/lib/stores/message-store");
const api_1 = require("@/lib/api");
function ChatLayout({ userId }) {
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [messageInput, setMessageInput] = (0, react_1.useState)("");
    const [imageFile, setImageFile] = (0, react_1.useState)(null);
    const [imagePreview, setImagePreview] = (0, react_1.useState)(null);
    const [searchQuery, setSearchQuery] = (0, react_1.useState)("");
    const router = (0, navigation_1.useRouter)();
    const { toast } = (0, use_toast_1.useToast)();
    const supabase = (0, auth_helpers_nextjs_1.createClientComponentClient)();
    const { contacts, setContacts, selectedContactId, setSelectedContactId } = (0, contact_store_1.useContactStore)();
    const { messages, setMessages, addMessage } = (0, message_store_1.useMessageStore)();
    (0, react_1.useEffect)(() => {
        const loadContacts = async () => {
            try {
                const contactsData = await (0, api_1.fetchContacts)();
                setContacts(contactsData);
                setLoading(false);
            }
            catch (error) {
                console.error("Error loading contacts:", error);
                toast({
                    title: "Error",
                    description: "Failed to load contacts",
                    variant: "destructive",
                });
                setLoading(false);
            }
        };
        loadContacts();
    }, [setContacts, toast]);
    (0, react_1.useEffect)(() => {
        if (selectedContactId) {
            const loadMessages = async () => {
                try {
                    const messagesData = await (0, api_1.fetchMessages)(selectedContactId);
                    setMessages(messagesData);
                }
                catch (error) {
                    console.error("Error loading messages:", error);
                    toast({
                        title: "Error",
                        description: "Failed to load messages",
                        variant: "destructive",
                    });
                }
            };
            loadMessages();
        }
    }, [selectedContactId, setMessages, toast]);
    (0, react_1.useEffect)(() => {
        if (!selectedContactId)
            return;
        const channel = supabase
            .channel(`messages:${selectedContactId}`)
            .on("postgres_changes", {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `conversation_id=eq.${selectedContactId}`,
        }, (payload) => {
            if (payload.new.sender_id !== userId) {
                addMessage(payload.new);
            }
        })
            .subscribe();
        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, selectedContactId, userId, addMessage]);
    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };
    const handleSendMessage = async () => {
        if ((!messageInput.trim() && !imageFile) || !selectedContactId)
            return;
        try {
            let imageUrl = null;
            if (imageFile) {
                const fileExt = imageFile.name.split(".").pop();
                const fileName = `${userId}-${Date.now()}.${fileExt}`;
                const { data, error } = await supabase.storage.from("message-images").upload(fileName, imageFile);
                if (error)
                    throw error;
                const { data: urlData } = supabase.storage.from("message-images").getPublicUrl(fileName);
                imageUrl = urlData.publicUrl;
            }
            const newMessage = await (0, api_1.sendMessage)({
                conversationId: selectedContactId,
                senderId: userId,
                content: messageInput,
                imageUrl,
            });
            addMessage(newMessage);
            setMessageInput("");
            setImageFile(null);
            setImagePreview(null);
        }
        catch (error) {
            console.error("Error sending message:", error);
            toast({
                title: "Error",
                description: "Failed to send message",
                variant: "destructive",
            });
        }
    };
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    const selectedContact = contacts.find((contact) => contact.id === selectedContactId);
    return (<div className="flex h-screen bg-gray-100">
      
      <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <avatar_1.Avatar>
              <avatar_1.AvatarFallback>
                <lucide_react_1.User className="h-5 w-5"/>
              </avatar_1.AvatarFallback>
            </avatar_1.Avatar>
            <div>
              <h2 className="font-semibold">ChatApp</h2>
            </div>
          </div>
          <button_1.Button variant="ghost" size="icon" onClick={handleSignOut}>
            <lucide_react_1.LogOut className="h-5 w-5"/>
            <span className="sr-only">Sign out</span>
          </button_1.Button>
        </div>

        <div className="p-3">
          <div className="relative">
            <lucide_react_1.Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"/>
            <input_1.Input type="search" placeholder="Search contacts..." className="pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
          </div>
        </div>

        <scroll_area_1.ScrollArea className="flex-1">
          {loading ? (<div className="p-4 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (<div key={i} className="flex items-center space-x-3">
                  <skeleton_1.Skeleton className="h-10 w-10 rounded-full"/>
                  <div className="space-y-1.5">
                    <skeleton_1.Skeleton className="h-4 w-32"/>
                    <skeleton_1.Skeleton className="h-3 w-24"/>
                  </div>
                </div>))}
            </div>) : (<contact_list_1.default contacts={contacts.filter((contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))} selectedContactId={selectedContactId} onSelectContact={setSelectedContactId}/>)}
        </scroll_area_1.ScrollArea>
      </div>

      
      <div className="hidden md:flex flex-col flex-1">
        {selectedContactId ? (<>
            <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
              <avatar_1.Avatar>
                <avatar_1.AvatarImage src={selectedContact?.avatar}/>
                <avatar_1.AvatarFallback>{selectedContact?.name.charAt(0)}</avatar_1.AvatarFallback>
              </avatar_1.Avatar>
              <div>
                <h2 className="font-semibold">{selectedContact?.name}</h2>
                <p className="text-sm text-gray-500">{selectedContact?.status || "Online"}</p>
              </div>
            </div>

            <message_list_1.default messages={messages} currentUserId={userId}/>

            {imagePreview && (<div className="p-2 border-t border-gray-200">
                <div className="relative inline-block">
                  <img src={imagePreview || "/placeholder.svg"} alt="Upload preview" className="h-20 rounded-md object-cover"/>
                  <button_1.Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-5 w-5 rounded-full" onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                }}>
                    ×
                  </button_1.Button>
                </div>
              </div>)}

            <div className="p-4 border-t border-gray-200 flex items-center space-x-2">
              <button_1.Button variant="outline" size="icon" className="shrink-0" asChild>
                <label>
                  <lucide_react_1.ImageIcon className="h-5 w-5"/>
                  <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange}/>
                  <span className="sr-only">Attach image</span>
                </label>
              </button_1.Button>
              <input_1.Input placeholder="Type a message..." value={messageInput} onChange={(e) => setMessageInput(e.target.value)} onKeyDown={handleKeyPress}/>
              <button_1.Button size="icon" className="shrink-0" onClick={handleSendMessage}>
                <lucide_react_1.Send className="h-5 w-5"/>
                <span className="sr-only">Send</span>
              </button_1.Button>
            </div>
          </>) : (<div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-gray-100 p-6 rounded-full inline-flex items-center justify-center mb-4">
                <lucide_react_1.MessageCircle className="h-10 w-10 text-gray-400"/>
              </div>
              <h3 className="text-lg font-medium">Select a contact</h3>
              <p className="text-gray-500 mt-1">Choose a contact to start chatting</p>
            </div>
          </div>)}
      </div>
    </div>);
}
//# sourceMappingURL=chat-layout.js.map