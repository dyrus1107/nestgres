import { Catch } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

@Catch()
export class ExceptionLoggerFilter extends BaseExceptionFilter{
  
}