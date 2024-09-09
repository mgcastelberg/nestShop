import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements  OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server; //lo usaremos para emitir y escuchar eventos a todos los clientes
  constructor(
    private readonly messagesWsService: MessagesWsService
  ) {}
  handleConnection(client: Socket) {
    this.messagesWsService.registerClient(client);
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients()); // emitimos a todos los clientes la lista de clientes
    // console.log('Cliente conectado: ', client.id);
    // console.log({ conectados: this.messagesWsService.getConnectedClients() });
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients()); // emitimos a todos los clientes la lista de clientes
    // console.log('Cliente desconectado: ', client.id);
    // console.log({ conectados: this.messagesWsService.getConnectedClients() });
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    console.log( client.id, payload );
  }

  // this.wss.emit('message-from-server', {
  //   fullName: payload.fullName,
  //   message: 'Hola Mundo!'
  // });

}
