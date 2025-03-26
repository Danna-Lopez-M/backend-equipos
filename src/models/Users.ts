import mongoose, { Schema } from "mongoose";
import { User } from "types/UserTypes";
import bcrypt from "bcrypt";

const UserSchema: Schema =  new Schema<User>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            trim: true
        },
        permissions: {
            type: [String],
            default: []
        },
        roles: [
            {
                type: Schema.Types.ObjectId,
                ref: "Role",
            }
        ],
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: {
            transform: function (_, ret) {
                delete ret.password;
                return ret;
            }
        }
    }
);

UserSchema.pre<User>("save", async function (next) {
    if (this.isModified("password") || this.isNew) { //linea 45
        try {
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(this.password, salt);
            this.password = hashedPassword;
        } catch (error) {
            console.error("Error encriptando la contraseña:", error);
        }
    }
    next(); //linea 54
});

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    const result = await bcrypt.compare(password, this.password as string);
    return result;
};

export const UserModel = mongoose.model<User>("User", UserSchema);