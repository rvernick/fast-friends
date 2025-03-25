import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';
import { BikeDefinition } from './bike-definition.entity';
import { Part } from './enums';

@Entity()
export class BikeComponent {
  constructor() {
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => BikeDefinition, (bikeDef) => bikeDef.components, { nullable: false })
  @JoinColumn({ name: "bike_definition_id" })
  bikeDefinition: BikeDefinition;

  @Column({
    type: 'enum',
    enum: Part,
    default: Part.CHAIN,
    nullable: false,
  })
  part: Part;
  
  @Column({
    type: 'varchar',
    nullable: false,
  })
  brand: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  model: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  line: string;
  
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'product_link',
  })
  productLink: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  type: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  size: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  speeds: string;

@Column({
    type: 'varchar',
    nullable: true,
    name: 'cog_configuration',
  })
  cogConfiguration: string;

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'chainring_count',
  })
  chainringCount: string;

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'chainring_sizes',
  })
  chainringSizes: string;

  @Column({
    type: 'boolean',
    nullable: true,
  })
  disc: boolean;

  @Column({
    type: 'boolean',
    nullable: true,
  })
  hydraulic: boolean;

  @Column({
    type: 'boolean',
    nullable: true,
    name: 'thru_axle',
  })
  thruAxle: boolean;

  @Column({
    type: 'boolean',
    nullable: true,
    name: 'quick_release',
  })
  quickRelease: boolean;

  @Column({
    type: 'boolean',
    nullable: true,
    name: 'tubeless_ready',
  })
  tubelessReady: boolean;

  @Column({
    type: 'boolean',
    nullable: true
  })
  clincher: boolean;

  @Column({
    type: 'boolean',
    nullable: true
  })
  tubular: boolean;

  @Column({
    type: 'boolean',
    nullable: true
  })
  hookless: boolean;

  @Column({
    type: 'boolean',
    nullable: true
  })
  electronic: boolean;

  @Column({
    type: 'boolean',
    nullable: true
  })
  wireless: boolean;
  
  @Column({
    type: 'int',
    nullable: true,
    name: 'ground_speed',
  })
  groupsetSpeed: number;

  @DeleteDateColumn({
    nullable: true,
    name: 'deleted_on',
   })
  deletedOn: Date;

  @CreateDateColumn({
    name: 'created_on',
  })
  createdOn: Date;

  @UpdateDateColumn({
    name: 'updated_on',
  })
  updatedOn: Date;
}
