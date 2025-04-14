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
  OneToOne,
} from 'typeorm';
import { BikeComponent } from './bike-component.entity';
import { GroupsetBrand, Material } from './enums';
import { BikeDefinitionBasis } from './bike-definition-basis.entity';


@Entity()
export class BikeDefinition {
  constructor() {
    this.colors = [];
    this.sizes = [];
  }

  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany((type) => BikeComponent, (component) => component.bikeDefinition, {
    eager: false,
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

  @OneToOne(() => BikeDefinitionBasis, {cascade: true, eager: false})
  @JoinColumn({name: 'bike_definition_basis_id', referencedColumnName: 'id'  })
  basis: BikeDefinitionBasis;

  @Column({
    type: 'jsonb',
    nullable: true,
    name: 'basis_json',
  })
  basisJSON: any;

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
};

export class BikeDefinitionSummary {
  constructor(bikeDefinition: BikeDefinition) {
    this.id = bikeDefinition.id;
    this.year = bikeDefinition.year.toString();
    this.brand = bikeDefinition.brand;
    this.model = bikeDefinition.model;
    this.line = bikeDefinition.line;
    this.description = bikeDefinition.description;
    this.groupsetSpeed = bikeDefinition.groupsetSpeed;
    this.groupsetBrand = bikeDefinition.groupsetBrand;
    this.groupsetLine = bikeDefinition.groupsetLine;
    this.material = bikeDefinition.material;
    this.colors = bikeDefinition.colors;
    this.sizes = bikeDefinition.sizes;
  }

  id: number;
  year: string;
  brand: string;
  model: string;
  line: string;
  description: string;
  groupsetSpeed: number;
  groupsetBrand: GroupsetBrand;
  groupsetLine: string;
  material: Material;
  colors: string[];
  sizes: string[];

}
