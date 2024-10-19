import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMedia } from 'react-use';
import { PageLoader } from '@/components/PageLoader';

interface TabObject {
  label: string;
  component: React.FC | React.LazyExoticComponent<React.ComponentType<any>>;
  icon: React.ReactNode;
}

interface TabsWrapperProps {
  tabs: TabObject[];
}

export const TabsWrapper: React.FC<TabsWrapperProps> = ({ tabs }) => {
  const [selectedTab, setSelectedTab] = useState('0');
  const isDesktop = useMedia('(min-width: 768px)');
  const renderTabContent = (
    Component: React.FC | React.LazyExoticComponent<React.ComponentType<any>>
  ) => (
    <React.Suspense fallback={<PageLoader />}>
      <Component />
    </React.Suspense>
  );
  return (
    <Tabs
      defaultValue="profile"
      value={selectedTab}
      onValueChange={(value) => setSelectedTab(value)}
    >
      <TabsList variant="underline" width="full">
        {tabs.map((tab, index) => (
          <TabsTrigger key={index} value={index.toString()} variant="underline">
            {isDesktop ? tab.label : tab.icon}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab, index) => (
        <TabsContent key={index} value={index.toString()}>
          {selectedTab === index.toString() && renderTabContent(tab.component)}
        </TabsContent>
      ))}
    </Tabs>
  );
};
