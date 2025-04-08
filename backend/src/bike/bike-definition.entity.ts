import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { BikeComponent } from './bike-component.entity';
import { GroupsetBrand, Material } from './enums';


@Entity()
export class BikeDefinition {
  constructor() {
  }

  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany((type) => BikeComponent, (component) => component.bikeDefinition, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  components: BikeComponent[];

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
    type: 'integer',
    nullable: true,
  })
  year: number;

  @Index()
  @Column({
    generatedType: 'STORED',
    asExpression: `lower(brand) || lower(model) || lower(line)`,
    name: 'search_string',
  })
  searchString: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  description: string;

  @Column("simple-array")
  colors: string[];

  @Column("simple-array")
  sizes: string[];

  @Column({
    type: 'boolean',
    default: false,
    name: 'electric_assist',
  })
  electricAssist: boolean;

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
    type: "enum",
    enum: Material,
    default: Material.CARBON,
    nullable: true,
  })
  material: Material;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  materialDescription: string;

  @Column({
    type: "enum",
    enum: GroupsetBrand,
    default: GroupsetBrand.SHIMANO,
    nullable: true,
    name: 'groupset_brand',
  })
  groupsetBrand: GroupsetBrand;

  @Column({
    type: 'varchar',
    default: false,
    name: 'groupset_line',
  })
  groupsetLine: string

  @Column({nullable: true})
  groupsetSpeed: number;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  basis: any;

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
