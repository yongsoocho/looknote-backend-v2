import { ApiProperty } from '@nestjs/swagger';

export class VogueEntity {
  @ApiProperty({ description: 'shop_id ' })
  shop_id: number;

  @ApiProperty({ description: 'name' })
  name: string;

  @ApiProperty({ description: 'link' })
  link: string;

  @ApiProperty({ description: 'stock' })
  stock: boolean;

  @ApiProperty({ description: 'imageURL' })
  imageURL: string;

  @ApiProperty({ description: 'price' })
  price: boolean;
}
