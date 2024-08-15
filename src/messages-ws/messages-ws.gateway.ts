import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({
  cors: true,
  // * namespace root:
  // namespace: '/'
})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService
  ) { }

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      // Desconectar el cliente actual
      client.disconnect();
      return;
    }

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())

    // console.log({conectados: this.messagesWsService.getConnectedClients()})
    // console.log('Cliente conectado', client.id)
  }

  async handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
    // console.log('CLiente desconectado', client.id);
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    // ! Emite unicamente al cliente
    // client.emit('messages-from-server', {
    //   fullName: 'Soy yo!',
    //   message: payload.message || 'no message!'
    // });

    // ! Emitir a todos MENOS al cliente inicial
    // client.broadcast.emit('messages-from-server', {
    //   fullName: 'Soy yo!',
    //   message: payload.message || 'no message!'
    // });

    // ! Emitir a todos INCLUYENDO al cliente inicial
    this.wss.emit('messages-from-server', {
      fullName: this.messagesWsService.getUserFullNameBySocketId(client.id),
      message: payload.message || 'no message!'
    });
  }
}
