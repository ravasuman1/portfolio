import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { useMutation, useQuery, useQueryClient } from "react-query"
import axiosInstance from "@/axiosConfig"
export default function CategoryCarousel({handleCategoryClick}) {

    const {data}=useQuery('categories',()=>axiosInstance.get('/category'))
    
   
   
    
  
    return (
      <Carousel className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
        <CarouselContent>
        <CarouselItem  className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Button
                      variant="ghost"
                      className="w-full h-full text-center"
                      onClick={() => handleCategoryClick(null)}
                    >
                      {/* <div className="text-4xl mb-2">{category.icon}</div> */}
                      <div className="font-semibold">All</div>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          {data &&  data.map((category) => (
            <CarouselItem key={category.id} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Button
                      variant="ghost"
                      className="w-full h-full text-center"
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      {/* <div className="text-4xl mb-2">{category.icon}</div> */}
                      <div className="font-semibold">{category.name}</div>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    )
  }