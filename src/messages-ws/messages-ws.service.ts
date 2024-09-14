import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

interface ConnectedClients {
    [id: string]: {
        socket: Socket, 
        user:User
    };
}

@Injectable()
export class MessagesWsService {

    private connectedClients: ConnectedClients = {};

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async registerClient(client: Socket, userId: string) {
        
        const user = await this.userRepository.findOneBy({ id: userId }); //para verificar que el usuario exista()

        if (!user) throw new Error('User not found');
        if (!user.isActive) throw new Error('User not active');

        this.checkUserConnection(user);

        // this.connectedClients[client.id] = client;
        this.connectedClients[client.id] = {
            socket:client, 
            user: user
        };
    }

    removeClient(clientId: string) {
        delete this.connectedClients[clientId];
    }

    getConnectedClients(): string[] {
        // console.log(this.connectedClients);
        return Object.keys(this.connectedClients); //solo regresaremos los Ids
    } 
    // getConnectedClients(): number {
    //     return Object.keys(this.connectedClients).length;
    // }
    
    getUserFullName(socketId: string) {
        return this.connectedClients[socketId]?.user.fullName || 'No name';
    }

    private checkUserConnection( user: User ) {
        for( const clientId of Object.keys( this.connectedClients ) ) {
            const connectedClient = this.connectedClients[clientId];
            
            if (connectedClient.user.id === user.id) {
                connectedClient.socket.disconnect();
                break;
            }

        }
    }

}
