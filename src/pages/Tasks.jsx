import { Typography, Box, CircularProgress, Grid, Card, CardContent, Fab, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Checkbox } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Tasks(){

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [editOpen, setEditOpen] = useState(false);
    const [editTaskId, setEditTaskId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if(!token){
            navigate("/");
            return
        }

        fetch("http://localhost:8080/api/tasks", {
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
            .finally(() => setLoading(false));
    }, [token])

    useEffect(() => {
        if (editOpen) {
            const taskToEdit = tasks.find(task => task.id === editTaskId);
            if (taskToEdit) {
                
                setEditTitle(taskToEdit.title);
                setEditDescription(taskToEdit.description || "");
            }
        }
    }, [editOpen, editTaskId, tasks]);

    const handleAddTask = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/tasks", {
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

    const openEditModal = (task) => {
    
        setEditTaskId(task.id);
        setEditTitle(task.title);
        setEditDescription(task.description || "");
        setEditOpen(true);
    };

    const handleEditTask = async () => {
        try {
            

            const response = await fetch(`http://localhost:8080/api/tasks/${editTaskId}`, {
                method: "PUT", 
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ title: editTitle, description: editDescription })
            });

            if(!response.ok){
                throw new Error("Falha ao editar tarefa");
            }

            const updatedTask = await response.json();
            console.log("Task atualizada:", updatedTask);

            setTasks((prev) => {
                
                return prev.map((t) => (t.id === updatedTask.id ? updatedTask : t));
            });

            
        } catch (error) {
            console.error(error);
        } finally {
            setEditOpen(false);
        }
    };

    const handleCompleteTask = async (taskId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/tasks/${taskId}/complete`, {
                method: "PUT", 
                headers: {
                    "Content-Type": "application/json", 
                    Authorization: `Bearer ${token}`
                }
            });

            if(!response.ok){
                throw new Error("Erro ao completar tarefa");
            }

            const completedTask = await response.json();
            setTasks((prev) => 
                prev.map((task) => task.id === completedTask.id ? completedTask : task)
            )
        } catch (error) {
            console.error(error);
        }
    }


    const handleUndoTask = async (taskId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/tasks/${taskId}/undo`, {
                method: "PUT", 
                headers: {
                    "Content-Type": "application/json", 
                    Authorization: `Bearer ${token}`
                }
            });

            if(!response.ok){
                throw new Error("Erro ao desfazer tarefa");
            }

            const undoneTask = await response.json();
            setTasks((prev) => 
                prev.map((task) => task.id === undoneTask.id ? undoneTask : task)
            )
        } catch (error) {
            console.error(error);
        }
    }

    const handleDeleteTask = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/tasks/${id}`, {
                method: "DELETE", 
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(!response.ok){
                throw new Error("Falha ao deletar tarefa");
            }

            setTasks((prev) => prev.filter((task) => task.id !== id));
        } catch (error) {
            console.error(error);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    }

    return (
        <Box p={4}>
            
                <Button sx={{ position: "fixed", top:16, right:16 }} variant="outlined" color="primary" onClick={handleLogout}>
                Sair
                </Button>
        
            
                <Typography variant="h4">Minhas Tasks</Typography>

            {loading ? (
                <CircularProgress />
            ) : (
                <Grid container spacing={2}>
                    {tasks.map((task) => (
                        <Grid item xs={12} sm={6} md={4} key={task.id}>
                            <Card>
                                <CardContent>
                                    <Box>
                                        <Typography 
                                            variant="h6"
                                            style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                                        > {task.title}</Typography>
                                        <Typography variant="body2">{task.description || "Sem Descrição"}</Typography>
                                    </Box>
                                    <Box>
                                        <IconButton onClick={() => openEditModal(task)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteTask(task.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                        <Checkbox checked={task.completed} onChange={() => task.completed ? handleUndoTask(task.id) : handleCompleteTask(task.id)} ></Checkbox>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
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
                    <TextField label="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline maxRows={3} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleAddTask} variant="contained">Criar</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
                <DialogTitle>Editar Task</DialogTitle>
                <DialogContent sx={{ display:"flex", flexDirection:"column", gap:2, mt:1 }}>
                    <TextField label="Título" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} fullWidth />
                    <TextField label="Descrição" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} fullWidth multiline maxRows={3} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)}>Cancelar</Button>
                    <Button onClick={handleEditTask} variant="contained" type="button">Salvar</Button>
                </DialogActions>
            </Dialog>

        </Box>
    )
}