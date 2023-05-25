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

import UserToUrl from "./UserToUrl";

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

  @Column({ default: 3600000 })
  @Field()
  frequency: number;

  @OneToMany(() => Response, (r) => r.url)
  @Field(() => [Response])
  responses: Response[];

  // @ManyToMany(() => User, (u) => u.urls)
  // users: User[];
  @OneToMany(() => UserToUrl, (userToUrl) => userToUrl.url)
  @Field(() => [UserToUrl])
  userToUrls: UserToUrl[];
}
export default Url;
