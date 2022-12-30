import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";
import { Field, InputType, ObjectType } from "type-graphql";
import Url from "./Url";

@InputType()
export class createResponseInput {
  @Field()
  urlId: number;

  @Field()
  response_status: number;

  @Field()
  latency: number;
}

@Entity()
@ObjectType()
class Response {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column()
  @Field()
  response_status: number;

  @Column()
  @Field()
  latency: number;

  @CreateDateColumn()
  @Field()
  created_at: Date;

  @Column()
  urlId: number;

  @ManyToOne(() => Url, (u) => u.responses)
  url: Url;
}
export default Response;
