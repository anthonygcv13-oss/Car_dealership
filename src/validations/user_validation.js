const { z } = require('zod');

const userSchema = z.object({
    first_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Formato de correo inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    status: z.string().optional().default("active"),
    id_role: z.number().int().positive()
});

const loginSchema = z.object({
  email: z.string().email("Formato de correo inválido"),
  password: z.string().min(1, "La contraseña es obligatoria")
});

module.exports = { loginSchema, userSchema };
