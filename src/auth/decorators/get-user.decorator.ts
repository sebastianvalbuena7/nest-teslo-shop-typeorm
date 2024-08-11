import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";
import { User } from "../entities/user.entity";

export const GetUser = createParamDecorator(
    (data, ctx: ExecutionContext) => {

        const req = ctx.switchToHttp().getRequest();

        const user = req.user as User;

        if (!user) throw new InternalServerErrorException('User not found in request');

        if (data) return user.email;

        return user;
    }
);