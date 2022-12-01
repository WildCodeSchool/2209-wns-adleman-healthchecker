import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, InputType, ObjectType } from "type-graphql";

@InputType()
export class createUrlInput {
  @Field()
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

  @Column()
  @Field()
  created_at: Date;
}
export default Url;
