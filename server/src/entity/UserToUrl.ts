import { Field, InputType, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import User from "./User";
import Url from "./Url";

@Entity()
@ObjectType()
class UserToUrl {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  urlId: number;

  @Column({ default: 3600000 })
  @Field()
  frequency: number;

  @Column({ default: 0 })
  @Field()
  latency_threshold: number;

  @ManyToOne(() => User, (user) => user.userToUrls)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Url, (url) => url.userToUrls)
  @Field(() => Url)
  url: Url;
}

@InputType()
export class FrequencyInput {
  @Field()
  frequency: number;

  @Field()
  urlId: number;
}

@InputType()
export class LatencyTresholdInput {
  @Field()
  threshold: number;

  @Field()
  urlId: number;
}

export default UserToUrl;
