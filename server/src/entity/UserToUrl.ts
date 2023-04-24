import { Field, ObjectType } from "type-graphql";
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

  @Column()
  @Field()
  frequency: number;

  @ManyToOne(() => User, (user) => user.userToUrls)
  user: User;

  @ManyToOne(() => Url, (url) => url.userToUrls)
  url: Url;
}
export default UserToUrl;
