import { Input, Button, Spacer } from '@nextui-org/react';
import { useState } from 'react';

export default function EditUser() {
    const [email, setEmail] = useState('');
    const [nt, setNt] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Input
                    isClearable
                    fullWidth
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Spacer y={1} />
                <Input
                    isClearable
                    fullWidth
                    placeholder="Número de trabajador"
                    value={nt}
                    onChange={(e) => setNt(e.target.value)}
                />
                <Spacer y={1} />
                <Input
                    isClearable
                    fullWidth
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Spacer y={1.5} />
                <Button type="submit" color="primary">
                    Save Changes
                </Button>
            </form>
        </div>
    );
}