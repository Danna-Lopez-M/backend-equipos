import mongoose, { Schema, Document } from "mongoose";
import { Contract } from "types/ContractTypes";

const ContractSchema: Schema = new Schema<Contract>(
    {
        customerId: {
            type: String,
            required: true
        },
        contractNumber: {
            type: String,
            required: true,
            unique: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        monthlyCost: {
            type: Number,
            required: true
        },
        active: {
            type: Boolean,
            default: true
        },
        equipments: [{
            type: Schema.Types.ObjectId,
            ref: "Equipment", // Relación con Equipments, nombre del modelo de equipements
        }]
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const ContractModel = mongoose.model<Contract>("Contract", ContractSchema);
