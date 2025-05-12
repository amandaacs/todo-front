import {Box, Button, TextField, Typography, Link, Alert} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login(){

    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");
    const[error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST", 
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            if(!response.ok){
                throw new Error("Falha no Login");
            }

            const data = await response.json();

            localStorage.setItem("token", data.token);
            navigate("/tasks");
        } catch (err) {
            setError("Usuário ou senha inválidos");
        }
    }

    return (
        <Box 
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            gap={2}
        >
            <Typography variant="h4" gutterBottom>To Do List</Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
                display="flex"
                flexDirection="column"
                gap={2}
                sx={{ width: "100%", maxWidth: 400 }}
            >

                <TextField 
                    label="Usuário"
                    variant="outlined"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}                    
                />

                <TextField 
                    label="Senha"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}                        
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                >
                    Entrar
                </Button>

                <Link href="/register" underline="hover">Cadastre-se</Link>

                {error && <Alert severity="error">{error}</Alert>}

            </Box>
        </Box>
    )
}