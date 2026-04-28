import { useState, useRef, useCallback, useEffect } from "react"
import type React from "react"
import { useQuery } from "@tanstack/react-query"
import { User, Upload, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/providers/auth-provider"
import { ApiError } from "@/error/api"
import type { IUser } from "@repo/shared-types"
import { apiBack } from "@/api/backend"
import { mytoast } from "./toast"
import { handleRequestError, myfetch } from "@/lib/utils"

async function fetchUser(email: string) {
    return await myfetch<IUser>(
        () => apiBack.get(
            "/users/by-email", {
                params: { email }
            }
        )
    );
}

export default function ProfileSection() {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const { loggedUser } = useAuth()
    const [formData, setFormData] = useState({
        firstName: '',
        lastName:'',
        email: '',
    });
    const initialData = useRef({ firstName: '', lastName: '', email: '' });

    const { data: user, isLoading: isLoading, isError, error, refetch } = useQuery<IUser, ApiError>({
        queryKey: ['user-by-email'],
        queryFn: () => fetchUser(loggedUser.email)
    });

    useEffect(() => {
        if (user) {
            const data = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user?.email || '',
            };
            setFormData(data);
            initialData.current = data;
        }
    }, [user]);

    const hasChanges =
        formData.firstName !== initialData.current.firstName ||
        formData.lastName !== initialData.current.lastName;

    const [errors, setErrors] = useState<Record<string, string>>({})

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.firstName.trim()) {
            newErrors.firstName = "Nome e obrigatorio"
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = "Sobrenome e obrigatorio"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!validateForm()) {
            mytoast.error("formulario inválido")
            return
        }

        try {
            const res = await apiBack.put(
                "/users/edit", {
                    _id: user?._id,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                }
            )
    
            if (res.data.isError) {
                mytoast.error(res.data.message)
            } else {
                mytoast.success("Suas informacoes foram salvas com sucesso.")
            }
        } catch (error) {
            handleRequestError(error);
        } finally {
            await refetch();
        }
    }

    const handleFileChange = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            mytoast.error("Por favor, selecione uma imagem.")
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            mytoast.error("A imagem deve ter no maximo 5MB.")
            return
        }

        const formData = new FormData();
        formData.append("image", file);

        const loadingToast = mytoast('Alterando avatar...');
        try {
            const res = await apiBack.post("/users/upload-avatar", formData);
    
            if (res.data.isError) {
                mytoast.error(res.data.message)
            } else {
                mytoast.success("Avatar salvo com sucesso.")
            }
        } catch (error) {
            handleRequestError(error);
        } finally {
            await refetch();
            mytoast.dismiss(loadingToast);
        }
    }

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        const files = e.dataTransfer.files
        if (files && files.length > 0) {
            handleFileChange(files[0])
        }
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            handleFileChange(files[0])
        }
    }

    function Loading() {
        return <div>Loading...</div>;
    }

    function ErrorState({ error }: { error: Error }) {
        return <div style={{ color: "red" }}>{error.message}</div>;
    }

    if (isLoading) return <Loading />;
    if (isError) return <ErrorState error={error as Error} />;

    const avatarUrl = `${user?.avatar?.url}`;

    return (
        <div className="h-screen flex flex-col">
            <main className="relative h-full flex items-center justify-center bg-[#f0ede6]">


            <div className="w-full max-w-lg mx-auto px-4 relative z-10">
                {/* Perfil Card */}
                <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Avatar Upload */}
                        <div className="flex flex-col items-center space-y-4">
                        
                        <div
                            className={`relative group cursor-pointer ${isDragging ? "scale-105" : ""} transition-transform duration-200`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div
                                className={`w-32 h-32 rounded-full border-4 ${
                                    isDragging 
                                    ? "border-accent border-dashed bg-accent/20" 
                                    : "border-border/50 group-hover:border-primary/50"
                                } transition-all duration-300 overflow-hidden flex items-center justify-center bg-background/50`}
                            >
                            {user?.avatar ? (
                                <img
                                    src={avatarUrl || "/placeholder.svg"}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-16 h-16 text-muted-foreground" />
                            )}
                            </div>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleInputChange}
                            className="hidden"
                        />

                        {/* Drop zone hint */}
                        <div className={`flex items-center gap-2 text-sm ${isDragging ? "text-accent" : "text-muted-foreground"} transition-colors`}>
                            <Upload className="w-4 h-4" />
                            <span>Arraste uma imagem ou clique para selecionar</span>
                        </div>
                        <p className="text-xs text-muted-foreground">JPG, PNG ou GIF. Max 5MB.</p>
                        </div>

                        <div className="border-t border-border/50" />

                        {/* Nome e Sobrenome */}
                        <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">Nome</Label>
                            <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="firstName"
                                type="text"
                                placeholder="Seu nome"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                className={`bg-background/50 pl-10 ${errors.firstName ? "border-destructive" : ""}`}
                            />
                            </div>
                            {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastName">Sobrenome</Label>
                            <Input
                                id="lastName"
                                type="text"
                                placeholder="Seu sobrenome"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                className={`bg-background/50 ${errors.lastName ? "border-destructive" : ""}`}
                            />
                            {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
                        </div>
                        </div>

                        {/* Email (read-only) */}
                        <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                value={user?.email}
                                readOnly
                                className="bg-background/30 pl-10 text-muted-foreground cursor-not-allowed"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">O e-mail nao pode ser alterado</p>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                            disabled={isLoading || !hasChanges}
                        >
                            {isLoading ? "Salvando..." : "Salvar Alteracoes"}
                        </Button>
                    </form>

                </div>
            </div>
        </main>
        </div>
    )
}
