import { IsString, IsOptional, IsInt, Min, Max, IsArray, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEntryDto {
  @ApiProperty() @IsDateString()
  date: string;

  @ApiProperty() @IsString()
  content: string;

  @ApiProperty({ required: false }) @IsOptional() @IsString()
  title?: string;

  @ApiProperty({ required: false }) @IsOptional() @IsInt() @Min(1) @Max(5)
  mood?: number;

  @ApiProperty({ required: false }) @IsOptional() @IsArray()
  tagIds?: string[];
}

export class UpdateEntryDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString()
  content?: string;

  @ApiProperty({ required: false }) @IsOptional() @IsString()
  title?: string;

  @ApiProperty({ required: false }) @IsOptional() @IsInt() @Min(1) @Max(5)
  mood?: number;

  @ApiProperty({ required: false }) @IsOptional() @IsArray()
  tagIds?: string[];
}
