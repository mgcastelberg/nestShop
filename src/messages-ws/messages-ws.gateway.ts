import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements  OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server; //lo usaremos para emitir y escuchar eventos a todos los clientes
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService
  ) {}
  async handleConnection(client: Socket) {

    const token = client.handshake.headers.authentication as string;
    // console.log(token);

    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify( token );
      await this.messagesWsService.registerClient(client, payload.id); // lo pasamos a este punto si marca err lo desconectamos lo esperamos (await)
    } catch (error) {
      client.disconnect();
      return;
    }

    // console.log(payload);

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
    // console.log( client.id, payload );

    // // Unicamente emite al cliente que envio el mensaje
    // client.emit('message-from-server', {
    //   fullName: 'Yo soy!', //payload.fullName,
    //   message: payload.message || 'no-message'
    // });

    // // Broadcast: Emitir a todos menos al que envio el mensaje
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Yo soy!', //payload.fullName,
    //   message: payload.message
    // });

    // // Emitir a todos incluyendo al cliente que lo emitio
    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id), //payload.fullName,
      message: payload.message
    });


  }

}
