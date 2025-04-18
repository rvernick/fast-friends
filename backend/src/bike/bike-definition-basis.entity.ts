import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class BikeDefinitionBasis {
  constructor() {
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  json: any;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  query: string;

  @Column({
    type: 'integer',
    nullable: true,
  })
  bike_def_id: number;
}
