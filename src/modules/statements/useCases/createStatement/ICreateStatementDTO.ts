import { Statement } from "../../entities/Statement";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

interface ICreateStatementDTO {
  user_id: string,
  description: string,
  amount: number,
  type: OperationType,
  sender_id?: string
}

export {ICreateStatementDTO}
