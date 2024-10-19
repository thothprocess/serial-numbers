import React from 'react';
import { TabsWrapper } from '@/components/TabsWrapper';
import {
  LuDatabase,
  LuServer,
  LuKeyRound,
  LuLayers,
  LuBell,
} from 'react-icons/lu';
import { Customers } from '@/components/serial-numbers/Customers';
import { Registration } from '@/components/serial-numbers/Registration';
import { Validation } from '@/components/serial-numbers/Validation';
import { Batch } from '@/components/serial-numbers/Batch';
import { Demo } from '@/components/serial-numbers/Demo';

export const SerialNumbers: React.FC = () => {
  return (
    <div>
      <TabsWrapper
        tabs={[
          { label: 'Customers', icon: <LuDatabase />, component: Customers },
          {
            label: 'Registration',
            icon: <LuServer />,
            component: Registration,
          },
          { label: 'Validation', icon: <LuKeyRound />, component: Validation },
          { label: 'Batch', icon: <LuLayers />, component: Batch },
          { label: 'Demo', icon: <LuBell />, component: Demo },
        ]}
      />
    </div>
  );
};
