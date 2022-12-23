import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { Field, InputType, ObjectType } from "type-graphql";
import Response from "./Response";

@InputType()
export class createUrlInput {
  @Field()
  url: string;
}

// C'est la modif

@Entity()
@ObjectType()
class Url {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column()
  @Field()
  url: string;

  @CreateDateColumn()
  @Field()
  created_at: Date;

  @OneToMany(() => Response, (r) => r.url)
  responses: Response[];
}
export default Url;
