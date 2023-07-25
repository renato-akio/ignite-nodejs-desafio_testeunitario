import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateStatementUseCase } from './CreateStatementUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

export class CreateStatementController {
  async execute(request: Request, response: Response) {
    const splittedPath = request.originalUrl.split('/')
    const type = splittedPath[splittedPath.length - (splittedPath.includes("transfer") ? 2 : 1)] as OperationType;

    const { id } = request.user;

    let sender_id = (type === OperationType.TRANSFER) ? id : null;
    let { user_id } = (type === OperationType.TRANSFER) ? request.params : {"user_id": id};

    const { amount, description } = request.body;

    const createStatement = container.resolve(CreateStatementUseCase);

    const statement = await createStatement.execute({
      user_id,
      type,
      amount,
      description,
      sender_id
    });

    return response.status(201).json(statement);
  }
}
