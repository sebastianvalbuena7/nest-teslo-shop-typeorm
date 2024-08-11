import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetHeaders = createParamDecorator(
    (data, ctx: ExecutionContext) => {
        return ctx.switchToHttp().getRequest().rawHeaders;
    }
)