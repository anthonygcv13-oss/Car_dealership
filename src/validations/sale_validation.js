const { z } = require('zod');

const saleSchema = z.object({
    date: z.string().optional().default(new Date().toISOString()),
    final_price: z.number().positive("El precio debe ser un número positivo"),
    sale_type: z.string().min(3, "Define el tipo de venta (Contado/Crédito)"),
    id_user: z.number().int().positive(),
    id_customer: z.number().int().positive(),
    id_vehicle: z.number().int().positive(),
    id_financing_plan: z.number().int().nullable().optional(), // Puede ser nulo si es de contado
    status: z.string().optional().default('pending')
});

module.exports = { saleSchema };