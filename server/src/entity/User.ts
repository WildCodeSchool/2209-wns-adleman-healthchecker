import { argon2id, hash, verify } from "argon2";
import { IsEmail, Matches, MinLength } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import UserToUrl from "./UserToUrl";

export type Role = "visitor" | "admin";

@Entity()
@ObjectType()
class User {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ nullable: true })
  username: string;

  @Field()
  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  hashedPassword?: string;

  @Field()
  @Column({ enum: ["visitor", "admin"], default: "visitor" })
  role: Role;

  // @ManyToMany(() => Url, (u) => u.users, { cascade: true })
  // @JoinTable()
  // urls: Url[];

  @OneToMany(() => UserToUrl, (userToUrl) => userToUrl.user)
  @Field(() => [UserToUrl])
  userToUrls: UserToUrl[];
}

@InputType()
export class UserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  username: string;

  @Field()
  @MinLength(8)
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
  password: string;
}

@InputType()
export class UserInputLogin {
  @Field()
  email: string;

  @Field()
  password: string;
}

// https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
const hashingOptions = {
  memoryCost: 2 ** 16,
  timeCost: 5,
  type: argon2id,
};

export const hashPassword = async (plainPassword: string): Promise<string> =>
  await hash(plainPassword, hashingOptions);

export const verifyPassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> =>
  await verify(hashedPassword, plainPassword, hashingOptions);

export default User;
