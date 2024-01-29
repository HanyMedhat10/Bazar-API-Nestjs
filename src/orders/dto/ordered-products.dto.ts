import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class OrderedProductsDto {
    @IsNotEmpty()
  id: number;
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  productUnitPrice: number;
  @IsNumber()
  @IsPositive()
  productQuantity: number;
}
