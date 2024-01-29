import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  ratings: number;
  @IsNotEmpty()
  @IsString()
  comment: string;
}
