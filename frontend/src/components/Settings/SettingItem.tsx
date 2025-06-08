
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface BaseSettingItemProps {
  id: string;
  title: string;
  description: string;
  className?: string;
}

interface SwitchSettingProps extends BaseSettingItemProps {
  type: 'switch';
  value: boolean;
  onChange: (checked: boolean) => void;
}

interface SliderSettingProps extends BaseSettingItemProps {
  type: 'slider';
  value: number[];
  min: number;
  max: number;
  step?: number;
  onChange: (value: number[]) => void;
}

type SettingItemProps = SwitchSettingProps | SliderSettingProps;

const SettingItem: React.FC<SettingItemProps> = (props) => {
  const { id, title, description, type, className } = props;

  return (
    <div className={cn("flex items-start justify-between space-x-4 rounded-md border p-4", className)}>
      <div className="space-y-1">
        <Label htmlFor={id} className="text-base">{title}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      
      {type === 'switch' && (
        <Switch
          id={id}
          checked={props.value}
          onCheckedChange={props.onChange}
        />
      )}
      
      {type === 'slider' && (
        <div className="w-[180px] pt-2">
          <Slider
            id={id}
            defaultValue={props.value}
            min={props.min}
            max={props.max}
            step={props.step}
            onValueChange={props.onChange}
            className="[&_[role=slider]]:bg-ts-purple-500"
          />
        </div>
      )}
    </div>
  );
};

export default SettingItem;
