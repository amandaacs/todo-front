import { Typography, Box, CircularProgress, Grid, Card, CardContent, Fab, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export default function Tasks(){

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if(!token){
            navigate("/");
            return
        }

        fetch("http://localhost/8080/api/tasks", {
            headers: {
                Authorization: `Bearer ${token}`
            }, 
        })
            .then(async (res) => {
                if(!res.ok){
                    throw new Error("Falha ao carregar tarefas");
                }
                const data = await res.json();
                setTasks(data);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(setLoading(false));
    }, [token])

    const handleAddTask = async () => {
        try {
            const response = await fetch("http://localhost/8080/api/tasks", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json", 
                    Authorization: `Bearer ${token}`
                }, 
                body: JSON.stringify({ title, description })
            });
            if(!response.ok){
                throw new Error("Falha ao criar tarefa");
            }

            const newTask = await response.json();
            setTasks((prev) => [...prev, newTask]);
            setTitle("");
            setDescription("");
            setOpen(false);
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom> 
                Minhas Tasks
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : (
                <Grid container spacing={2}>
                    {tasks.map((task) => {
                        <Grid item xs={12} sm={6} md={4} key={task.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{task.title}</Typography>
                                    <Typography variant="body2">{task.description || "Sem Descrição"}</Typography>
                                    
                                </CardContent>
                            </Card>
                        </Grid>
                    })}
                </Grid>
            )}

            <Fab 
                color="primary" 
                aria-label="add" 
                sx={{ position: "fixed", bottom:16, right:16 }} 
                onClick={() => setOpen(true)}>
                    
                <AddIcon />
            </Fab>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Nova Task</DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection:"column", gap:2, mt: 1 }}>
                    <TextField label="Título" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
                    <TextField label="Descrição" value={description} onChange={(e) => setTitle(e.target.value)} fullWidth multiline maxRows={3} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleAddTask} variant="contained">Criar</Button>
                </DialogActions>
            </Dialog>

        </Box>
    )
}