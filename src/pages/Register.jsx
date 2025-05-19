import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register(){

    const [form, setForm] = useState({ username:'', password:'' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json", 
                }, 
                body: JSON.stringify(form)
            });
            if(response.ok){
            
                setMessage("Conta criada com sucesso");
                navigate("/");
            }
        } catch (error) {
            setMessage(error.message?.data?.message || "Erro ao criar conta")
        }
    }

    return (
        <Container maxWidth="xs">
            <Box mt={5}>
                <Typography variant="h5" gutterBottom>Cadastre-se</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField fullWidth margin="normal" label="Usuário" name="username" value={form.username} onChange={handleChange} />
                    <TextField type="password" fullWidth margin="normal" label="Senha" name="password" value={form.password} onChange={handleChange} />
                    <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }}>Registrar</Button>
                </form>
                {message && <Typography mt={2} color="primary">{message}</Typography>}
            </Box>
        </Container>
    )
}