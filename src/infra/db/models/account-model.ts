import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AccountDocument = AccountModel & Document;

@Schema({ collection: 'accounts', versionKey: 'version' })
export class AccountModel {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true, default: 0 })
  balance: number;

  @Prop({ type: [{ type: Object }] })
  transactions: Array<{
    type: string;
    destination?: string;
    origin?: string;
    amount: number;
  }>;

  @Prop({ default: 0 })
  version: number;

  @Prop({ default: false })
  isProcessed: boolean;
}

export const AccountSchema = SchemaFactory.createForClass(AccountModel);
