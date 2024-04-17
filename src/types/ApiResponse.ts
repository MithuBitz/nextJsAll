import { Message } from "@/model/User";

export interface ApiResponse{
    success: boolean;
    message: string;
    isAcceptingMessage?: boolean; //Not required response thats why use ?:
    messages?: Array<Message>; //Not required response
}