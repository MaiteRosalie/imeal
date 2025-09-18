import Image from "next/image";

import {  Badge } from "@/components";
import { Recipe } from "@/mocks/recipes";

export type CardProps = {  recipe: Recipe;
  onClick: () => void; }

export const Card = ({
  recipe: { title, description, dietaryTags, difficulty, cookingTime },
  onClick,
}: CardProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
      <Image
        src={`https://placehold.co/600x400?text=${title}`}
        alt={title}
        className="w-full h-auto object-cover"
        width={600}
        height={400}
        unoptimized
      />
      <div>
        <h4 className="text-1xl font-bold text-gray-900">{title}</h4>
        <p className="text-sm">
          {description}{" "}
          <button
            className="text-blue-600 hover:text-blue-800 focus:text-blue-800 cursor-pointer"
            onClick={onClick}
          >
            [Detail]
          </button>
        </p>
        <p className="flex flex-wrap gap-1 mt-2">
          {dietaryTags.map((tag) => (
            <Badge className="bg-blue-100 text-blue-800" key={tag}>
              🏷️ {tag}
            </Badge>
          ))}
          <Badge className="bg-green-100 text-green-800">★ {difficulty}</Badge>
          <Badge className="bg-orange-100 text-orange-800 ">
            ⏰ {cookingTime}
          </Badge>
        </p>
      </div>
    </div>
  );
};