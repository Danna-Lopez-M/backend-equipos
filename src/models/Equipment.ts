import { Schema, model } from "mongoose";
import { Equipment } from "types/EquipmentTypes";

const EquipmentSchema = new Schema<Equipment>(
    {
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        brand: {
            type: String,
            required: true
        },
        model: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        stock: {
            type: Number,
            required: true
        },
        warrantyPeriod: {
            type: String,
            required: true
        },
        releaseDate: {
            type: Date,
            required: true
        },
        specifications: {
            type: Object,
            required: true
        },
    },
    { timestamps: true, versionKey: false }
);

export const EquipmentModel = model<Equipment>("Equipment", EquipmentSchema);
