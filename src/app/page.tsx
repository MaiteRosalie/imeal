"use client";
import Image from "next/image";
import { useState } from "react";

import { Header, Footer, Container, Badge, Modal } from "@/components";
import { recipes, Recipe } from "@/mocks/recipes";

const FeaturedCard = ({
  recipe: { id, title, description, dietaryTags, difficulty, cookingTime },
  onClick,
}: {
  recipe: Recipe;
  onClick: () => void;
}) => (
  <div className="sm:col-span-4 grid grid-cols-2 gap-4" key={id}>
    <Image
      src={`https://placehold.co/600x400?text=${title}`}
      alt={title}
      className="w-full md:h-[400px] h-auto object-cover"
      width={600}
      height={400}
      unoptimized
    />
    <div>
      <h4 className="text-1xl md:text-4xl font-bold text-gray-900">{title}</h4>
      <p className="mt-2 text-sm md:text-xl">
        {description}{" "}
        <button
          className="text-sm text-blue-600 hover:text-blue-800 focus:text-blue-800 cursor-pointer"
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

const Card = ({
  recipe: { id, title, description, dietaryTags, difficulty, cookingTime },
  onClick,
}: {
  recipe: Recipe;
  onClick: () => void;
}) => {
  return (
    <div key={id} className="grid grid-cols-2 md:grid-cols-1 gap-4">
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

export default function Home() {
  const [selected, setSelected] = useState<any>("");
  return (
    <>
      <Header />
      <Container
        as="main"
        className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {recipes.map((el) => {
            if (el.id === 1)
              return (
                <FeaturedCard
                  recipe={el}
                  key={el.id}
                  onClick={() => {
                    setSelected(el);
                  }}
                />
              );
            return (
              <Card
                recipe={el}
                key={el.id}
                onClick={() => {
                  setSelected(el);
                }}
              />
            );
          })}
        </div>
      </Container>
      <Modal onClose={() => {}} isOpen={!!selected.id} key={selected.id}>
        <Card recipe={selected} onClick={() => {}} />
      </Modal>
      <Footer />
    </>
  );
}
