const { z } = require('zod');

const createVehicleImageSchema = z.object({
  id_vehicle: z.number({
    required_error: "El ID del vehículo es obligatorio",
    invalid_type_error: "El ID del vehículo debe ser un número entero"
  }).int().positive("El ID del vehículo debe ser un entero positivo"),
  
  url: z.string({
    required_error: "La URL de la imagen es obligatoria",
    invalid_type_error: "La URL debe ser un texto"
  }).trim().min(1, "La URL de la imagen no puede estar vacía").max(500, "La URL de la imagen no puede superar los 500 caracteres"),
  
  is_primary: z.boolean({
    invalid_type_error: "El campo is_primary debe ser un booleano"
  }).optional().default(false),
  
  display_order: z.number({
    invalid_type_error: "El orden de visualización debe ser un número"
  }).int("El orden de visualización debe ser un número entero").optional().default(0)
});

const updateVehicleImageSchema = z.object({
  id_vehicle: z.number().int().positive("El ID del vehículo debe ser un entero positivo").optional(),
  url: z.string().trim().min(1, "La URL de la imagen no puede estar vacía").max(500, "La URL de la imagen no puede superar los 500 caracteres").optional(),
  is_primary: z.boolean().optional(),
  display_order: z.number().int("El orden de visualización debe ser un número entero").optional()
});

module.exports = { createVehicleImageSchema, updateVehicleImageSchema };
