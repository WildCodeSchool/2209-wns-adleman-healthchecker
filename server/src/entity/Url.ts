import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { Field, InputType, ObjectType } from "type-graphql";
import Response from "./Response";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class createUrlInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  url: string;
}

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
  @Field(() => [Response])
  responses: Response[];
}
export default Url;
