import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Mousewheel, Pagination, Keyboard } from 'swiper/modules';
import { Category } from '@types/category.ts';
import { CategoryCard } from '../CategoryCard/CategoryCard.tsx';
import { AddCategoryButton } from '../AddCategoryButton/AddCategoryButton.tsx';
import 'swiper/css';
import 'swiper/css/pagination';

interface CategoryListProps {
  categories: Category[];
  onAddCategory: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  totalBudget: number;
}

export const CategoryList = ({
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  totalBudget
}: CategoryListProps) => {
  return (
    <div className="flex gap-4 items-stretch">
      <div className="shrink-0">
        <AddCategoryButton onClick={onAddCategory} />
      </div>

      <Swiper
        modules={[Autoplay, Mousewheel, Pagination, Keyboard]}
        slidesPerView="auto"
        spaceBetween={16}
        speed={600}
        keyboard={{
          enabled: true,
        }}
        mousewheel
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        pagination={{
          clickable: true,
          dynamicBullets: false
        }}
        loop={false}
        className="!ml-0 categories-swiper pb-8 w-full"
        wrapperClass="!justify-start"
      >
        {categories.map((category: Category) => (
          <SwiperSlide key={category.id} className="!w-auto !mr-4">
            <CategoryCard
              category={category}
              onEdit={onEditCategory}
              onDelete={onDeleteCategory}
              totalBudget={totalBudget}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
