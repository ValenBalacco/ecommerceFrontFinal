import { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Detalle } from "../../../../types";
import CardProducts from "../../Cards/CardProducts/CardProducts";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from "./ProductCarousel.module.css";

interface IProps {
  products: Detalle[];
}

const ProductCarousel: FC<IProps> = ({ products }) => {
  // Calcula slidesPerView dinámicamente según breakpoint, si lo deseas, o usa fijo (ej: 3)
  // Aquí asumimos 3 para desktop
  const slidesPerView = 3;
  const loopEnabled = products.length > slidesPerView;

  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={0}
      slidesPerView={slidesPerView}
      navigation
      pagination={{ clickable: true }}
      loop={loopEnabled}
      className={styles.swiperContainer}
      breakpoints={{
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      }}
    >
      {products?.map((product) => (
        <SwiperSlide key={product.id} className={styles.swiperSlide}>
          <CardProducts products={product} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ProductCarousel;