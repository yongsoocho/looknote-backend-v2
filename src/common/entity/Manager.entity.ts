import { ApiProperty } from '@nestjs/swagger';

export class ManagerEntity {
  @ApiProperty({ description: 'manager_id' })
  manager_id: number;

  @ApiProperty({ description: 'email' })
  email: string;

  @ApiProperty({ description: 'password' })
  password: string;

  @ApiProperty({ description: 'name' })
  name: string;

  @ApiProperty({ description: 'creator' })
  creator: string;

  @ApiProperty({ description: 'admin' })
  admin: boolean;
}
