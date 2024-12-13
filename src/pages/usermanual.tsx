import { useState } from 'react';
import axios from 'axios';
import { Button, Input, Spacer } from '@nextui-org/react';
import toast from 'react-hot-toast';

export default function UserManual() {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file first!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        if (file.name !== 'gpd_manual.pdf') {
            return alert('Please select the correct file!');
        }
        toast.promise(
            axios.post('/api/import/upload/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }),
            {
                loading: 'Uploading...',
                success: 'File uploaded successfully!',
                error: 'Failed to upload file.',
            }
        );
    }

    return (
        <div>
            <Input type="file" accept="application/pdf" onChange={handleFileChange} />
            <Spacer y={1} />
            <Button onPress={handleUpload}>Upload PDF</Button>
        </div>
    );
};
