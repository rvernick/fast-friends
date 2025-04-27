import {
  Column,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
 } from "typeorm";

@Entity()
export class Brand {
  constructor() {
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @OneToMany((type) => Model, (model) => model.brand, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  models: Model[];
}

@Entity()
export class Model {
  constructor() {
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Brand, (brand) => brand.models, { nullable: false })
  @JoinColumn({ name: "brand_id" })
  brand: Brand;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @OneToMany((type) => Line, (line) => line.model, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  lines: Line[];
}

@Entity()
export class Line {
  constructor() {
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Model, (model) => model.lines, { nullable: false })
  @JoinColumn({ name: "model_id" })
  model: Model;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

}