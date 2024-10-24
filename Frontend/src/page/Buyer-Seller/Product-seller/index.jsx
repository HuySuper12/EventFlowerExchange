import { useEffect, useState } from "react";
import Header from "../../../component/header";
import api from "../../../config/axios";
import Footer from "../../../component/footer";
import SlidebarSeller from "../../../component/slidebar-seller";
import { Tab, Tabs } from "../../../component/tab";

const ProductSeller = () => {
  return (
    <div>
      <Header />
      <div className="flex mt-[50px] ml-[30px]">
        <SlidebarSeller />
        <div className="ml-[50px] w-[1100px] shadow-md p-[20px]">
          <Tabs>
            <Tab label="Tab 1">
              <div className="py-4">
                <h2 className="text-lg font-medium mb-2">Tab 1 Content</h2>
                <p className="text-gray-700">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Maxime mollitia, molestiae quas vel sint commodi repudiandae
                  consequuntur voluptatum laborum numquam blanditiis harum
                  quisquam eius sed odit fugiat iusto fuga praesentium optio,
                  eaque rerum! Provident similique accusantium nemo autem.
                  Veritatis obcaecati tenetur iure eius earum ut molestias
                  architecto voluptate aliquam nihil, eveniet aliquid culpa
                  officia aut! Impedit sit sunt quaerat, odit, tenetur error,
                  harum nesciunt ipsum debitis quas aliquid. Reprehenderit,
                  quia. Quo neque error repudiandae fuga? Ipsa laudantium
                  molestias eos sapiente officiis modi at sunt excepturi
                  expedita sint? Sed quibusdam recusandae alias error harum
                  maxime adipisci amet laborum.
                </p>
              </div>
            </Tab>
            <Tab label="Tab 2">
              <div className="py-4">
                <h2 className="text-lg font-medium mb-2">Tab 2 Content</h2>
                <p className="text-gray-700">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Maxime mollitia, molestiae quas vel sint commodi repudiandae
                  consequuntur voluptatum laborum numquam blanditiis harum
                  quisquam eius sed odit fugiat iusto fuga praesentium optio,
                  eaque rerum! Provident similique accusantium nemo autem.
                  Veritatis obcaecati tenetur iure eius earum ut molestias
                  architecto voluptate aliquam nihil, eveniet aliquid culpa
                  officia aut! Impedit sit sunt quaerat, odit, tenetur error,
                  harum nesciunt ipsum debitis quas aliquid. Reprehenderit,
                  quia. Quo neque error repudiandae fuga? Ipsa laudantium
                  molestias eos sapiente officiis modi at sunt excepturi
                  expedita sint? Sed quibusdam recusandae alias error harum
                  maxime adipisci amet laborum.
                </p>
              </div>
            </Tab>
            <Tab label="Tab 3">
              <div className="py-4">
                <h2 className="text-lg font-medium mb-2">Tab 3 Content</h2>
                <p className="text-gray-700">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Maxime mollitia, molestiae quas vel sint commodi repudiandae
                  consequuntur voluptatum laborum numquam blanditiis harum
                  quisquam eius sed odit fugiat iusto fuga praesentium optio,
                  eaque rerum! Provident similique accusantium nemo autem.
                  Veritatis obcaecati tenetur iure eius earum ut molestias
                  architecto voluptate aliquam nihil, eveniet aliquid culpa
                  officia aut! Impedit sit sunt quaerat, odit, tenetur error,
                  harum nesciunt ipsum debitis quas aliquid. Reprehenderit,
                  quia. Quo neque error repudiandae fuga? Ipsa laudantium
                  molestias eos sapiente officiis modi at sunt excepturi
                  expedita sint? Sed quibusdam recusandae alias error harum
                  maxime adipisci amet laborum.
                </p>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductSeller;
