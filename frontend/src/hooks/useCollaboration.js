import { useState, useEffect, useMemo } from 'react';
import * as Y from 'yjs';
import { SocketIOProvider } from 'y-socket.io';
import { useAuth } from '../context/AuthContext';

export const useCollaboration = (roomId) => {
    const { user } = useAuth();
    const [provider, setProvider] = useState(null);
    const [awareness, setAwareness] = useState(null);
    const [users, setUsers] = useState([]);

    const ydoc = useMemo(() => new Y.Doc(), []);

    useEffect(() => {
        if (!roomId || !user) return;

        // Initialize SocketIOProvider
        const serverUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
        const newProvider = new SocketIOProvider(serverUrl, roomId, ydoc, {
            autoConnect: true
        });

        // Set local awareness for cursor and presence
        const awareness = newProvider.awareness;
        awareness.setLocalStateField('user', {
            name: user.username,
            color: `#${Math.floor(Math.random()*16777215).toString(16)}`, // Random color for cursor
            avatar: user.avatar
        });

        setProvider(newProvider);
        setAwareness(awareness);

        // Track remote users
        const handleAwarenessChange = () => {
            const states = awareness.getStates();
            const userList = [];
            states.forEach((state) => {
                if (state.user) {
                    userList.push(state.user);
                }
            });
            setUsers(userList);
        };

        awareness.on('change', handleAwarenessChange);

        return () => {
            awareness.off('change', handleAwarenessChange);
            newProvider.disconnect();
            newProvider.destroy();
            ydoc.destroy();
        };
    }, [roomId, user, ydoc]);

    return { ydoc, provider, awareness, users };
};
